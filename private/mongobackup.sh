#!/bin/sh
PATH=".:/bin:/usr/bin"
HOST="127.0.0.1"
PORT="3003"
DUMP="/usr/bin/mongodump"
DATE=$(date +%Y-%m-%d)
DEST="/var/node/dump/$DATE"
if [ ! -d $DEST ]; then mkdir -p $DEST; fi;
$DUMP -h $HOST:$PORT -o "$DEST/nsaobserver"

