
manifest.json: manifest_default.json icon/manifest.json
	jq -s '.[0] * {"icons": .[1] | map(. * {src: ("$(dir $(word 2, $^))" + .src) }) }' $^ > manifest.json

favicon.ico: icon/32x32.ico
	cp $^ $@

icon/%:
	make -C icon $*

PHONY: all
all: favicon.ico manifest.json
