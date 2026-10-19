import nextEnv from '@next/env';
import { randomUUID, randomBytes } from 'node:crypto';
import assert from 'node:assert/strict';
nextEnv.loadEnvConfig(process.cwd(),true);
const {auth,authPool}=await import('../src/lib/auth.ts');
const origin=new URL(process.env.BETTER_AUTH_URL).origin;
const users=[];
const testDestination=`media-test-${randomUUID()}`;
async function account() {
  const response=await auth.handler(new Request(`${origin}/api/auth/sign-up/email`,{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify({name:'Media integration test',email:`media-${randomUUID()}@example.com`,password:randomBytes(24).toString('hex')})}));
  assert.equal(response.status,200);
  const {user}=await response.json(); users.push(user.id);
  return {id:user.id,cookie:response.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ')};
}
async function request(path,user,method='GET',body,extra={}) {
  return fetch(`${origin}${path}`,{method,headers:{origin,...(user?{cookie:user.cookie}:{}),...extra},...(body===undefined?{}:{body})});
}
async function json(response) { assert.equal(response.status,200,await response.clone().text()); return response.json(); }
try {
  if (!process.argv.includes('--cleanup')) {
  const admin=await account(),viewer=await account();
  await authPool.query('INSERT INTO vien_admins(user_id) VALUES ($1)',[admin.id]);
  assert.equal((await request('/api/media/catalog')).status,401);
  assert.equal((await json(await request('/api/media/catalog',viewer))).isAdmin,false);
  assert.equal((await json(await request('/api/media/catalog',admin))).isAdmin,true);
  for (const [path,method] of [['/api/admin/media/uploads','POST'],['/api/admin/media/uploads/fake?index=0','PUT'],['/api/admin/media/uploads/fake','DELETE'],['/api/admin/media/uploads/fake/complete','POST']]) assert.equal((await request(path,viewer,method)).status,403);
  const destinations=await json(await request('/api/destinations',admin));
  const upload=await json(await request('/api/admin/media/uploads',admin,'POST',JSON.stringify({destinationId:destinations[0].id,kind:'video',contentType:'video/mp4',size:1048608}),{'Content-Type':'application/json'}));
  // Publish under a unique test key so real destination media never changes.
  await authPool.query('UPDATE vien_media_assets SET destination_id=$1 WHERE id=$2',[testDestination,upload.uploadId]);
  const path=`/api/admin/media/uploads/${upload.uploadId}`;
  assert.equal((await request(`${path}/complete`,admin,'POST')).status,409);
  const bytes=Buffer.alloc(1048608,7); bytes.write('ftyp',4);
  assert.equal((await request(`${path}?index=0`,admin,'PUT',Buffer.alloc(1048576))).status,400);
  await json(await request(`${path}?index=0`,admin,'PUT',bytes.subarray(0,1048576)));
  await json(await request(`${path}?index=1`,admin,'PUT',bytes.subarray(1048576)));
  await json(await request(`${path}/complete`,admin,'POST'));
  await json(await request(`${path}/complete`,admin,'POST'));
  const url=`/api/media/${upload.uploadId}`;
  assert.equal((await request(url)).status,401);
  const full=await request(url,viewer); assert.equal(full.status,200); assert.deepEqual(Buffer.from(await full.arrayBuffer()),bytes);
  const range=await request(url,viewer,'GET',undefined,{Range:'bytes=1048570-1048580'});
  assert.equal(range.status,206); assert.deepEqual(Buffer.from(await range.arrayBuffer()),bytes.subarray(1048570,1048581));
  const suffix=await request(url,viewer,'GET',undefined,{Range:'bytes=-8'});
  assert.equal(suffix.status,206); assert.equal((await suffix.arrayBuffer()).byteLength,8);
  assert.equal((await request(url,viewer,'GET',undefined,{Range:'bytes=2000000-'})).status,416);
  assert.equal((await request(url,viewer,'HEAD')).headers.get('Content-Length'),String(bytes.length));
  console.log('PASS: admin upload, viewer read-only, incomplete/signature validation, idempotent publish, full and ranged video streaming.');
  }
} finally {
  await authPool.query('DELETE FROM vien_destination_media WHERE destination_id=$1',[testDestination]);
  const previous = await authPool.query("SELECT id FROM \"user\" WHERE name='Media integration test' AND email ~ '^media-[0-9a-f-]{36}@example[.]com$'");
  for(const id of new Set([...users,...previous.rows.map(row=>row.id)])) { await authPool.query('DELETE FROM vien_media_assets WHERE created_by=$1',[id]); await authPool.query('DELETE FROM "user" WHERE id=$1',[id]); }
  await authPool.query("DELETE FROM vien_destination_media WHERE destination_id LIKE 'media-test-%' AND cover_id IS NULL AND video_id IS NULL");
  await authPool.end();
}
