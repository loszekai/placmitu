FROM node:25.8.1

# Rename existing node user/group to app (keeps UID/GID = 1000)
RUN usermod -l app node \
    && groupmod -n app node \
    && usermod -d /home/app -m app

ENV HOME=/home/app

WORKDIR /var/www/app

USER app

CMD ["tail", "-f", "/dev/null"]
