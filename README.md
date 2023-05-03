# Zora

A tiny bot to enforce styling onto nicknames

## Invite the bot

Invite the bot using [this](https://discord.com/api/oauth2/authorize?client_id=1103317767752523817&permissions=134217728&scope=bot%20applications.commands) URL.

### Setup

Setup is super duper simple. By default, the bot is disabled. To enable it, do `/transform`. You'll then see five options, choose the one you want.

## Running the bot

If you don't want to use the hosted version, you can run your own instance pretty simply.

### Create a volume

This bot uses SQLite for data storage, so a volume is needed in order for it to function within Docker.

```bash
docker volume create zora-storage
```

### Run the container

```bash
# Pull the docker image
docker pull ghcr.io/astridlol/zora:main

# Run a container with the image
docker run --name zora -e TOKEN=[your token] -v zora-storage:/app -d --restart always ghcr.io/astridlol/zora:main
```
