FROM nginx:latest

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

COPY ./srcs/nginx/crypted_data/* /etc/nginx/ssl/

COPY ./srcs/nginx/nginx.conf /etc/nginx/http.d/

RUN chmod +x /server.sh

CMD ["/bin/bash", "-c", "/server.sh && nginx -g 'daemon off;'"]
