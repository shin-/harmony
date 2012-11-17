all: create-frontend
sio-on-dotcloud:
	wget https://github.com/shin-/stack.io-on-dotcloud/archive/master.tar.gz
	tar -xf master.tar.gz
	mv stack.io-on-dotcloud-master stack.io-on-dotcloud/
	rm master.tar.gz

create-frontend: sio-on-dotcloud
	mkdir stack.io-on-dotcloud/frontend
	wget https://github.com/downloads/shin-/stack.io-on-dotcloud/stack.io.js
	mv stack.io.js stack.io-on-dotcloud/frontend/
	cd -
	cp bp/* stack.io-on-dotcloud/frontend/
	echo "\nfrontend:\n    type: nodejs\n    approot: frontend\n    config:\n        node_version: v0.8.x\n" >> stack.io-on-dotcloud/dotcloud.yml

add-redis:
	cp services/redis.js stack.io-on-dotcloud/project/
	echo "\n[program:redisservice]\ncommand = /home/dotcloud/current/start.sh redis\ndirectory = /home/dotcloud/current/\n" >> stack.io-on-dotcloud/supervisord.conf
	echo "\nstore:\n    type: redis\n" >> stack.io-on-dotcloud/dotcloud.yml
	node ./tools/dependency-injector.js ./stack.io-on-dotcloud/project/package.json ./services/redis-dep.json
clean:
	rm -f master.tar.gz
	rm -f stack.io.js*
	rm -rf stack.io-on-dotcloud*

deploy:
	cd stack.io-on-dotcloud; dotcloud connect $(APP); dotcloud push; dotcloud open frontend
create-app:
	cd stack.io-on-dotcloud; dotcloud create $(APP)