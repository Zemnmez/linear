.DEFAULT_GOAL := help

#: call makefiles in other directories
public/% src/%: .FORCE
	$(MAKE) -C $(dir $@) $(notdir $@)

.PHONY: all

#: generate all build-time deps
all: .FORCE public/manifest.json \
	src/components/Home/static/ash.jpg \

.PHONY: invalidate_cache

#: invalidate cloudformation cache of changed static assets
invalidate_cache:
	./invalidate-cache.sh

.PHONY: .FORCE
.FORCE:

.PHONY: help

#: print help for folder with makefile
help/%: .FORCE
	@remake -inC "$*" --tasks 2>/dev/null | sed 's#^#$*/#' | sed 's#^./##' | sed -n '/#/p' | tr '[:blank:]' ' ' | column -tx -s'#'

#: print help for all makefiles recursively
help: .FORCE $(dir $(addprefix help/,$(wildcard */Makefile))) help/.
	@echo "NB: make is primarily used instrumentation. Most build commands are via 'yarn run'."


.PHONY: build

#: make full production build
build: yarn run build

.PHONY: deploy

#: make full production build and deploy it
deploy: yarn run deploy
