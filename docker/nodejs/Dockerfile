FROM node:latest

RUN usermod -l app node \
    && groupmod -n app node \
    && usermod -d /home/app -m app

ENV HOME=/home/app

WORKDIR /var/www/app

COPY --chown=app:app . .

CMD ["tail", "-f", "/dev/null"]
