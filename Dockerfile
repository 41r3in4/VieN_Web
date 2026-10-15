FROM php:8.3-apache
RUN a2enmod rewrite headers deflate \
 && sed -ri 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf \
 && sed -ri 's!<Directory /var/www/>!<Directory /var/www/html/public/>!; s!AllowOverride None!AllowOverride All!' /etc/apache2/apache2.conf
WORKDIR /var/www/html
COPY . /var/www/html
ENV APP_ENV=production
EXPOSE 80
