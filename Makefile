.DEFAULT_GOAL := help

#: call makefiles in other directories
public/% src/%: .FORCE
	$(MAKE) -C $(dir $@) $(notdir $@)

.PHONY: all

ALL_TARGETS=public/manifest.json src/components/Home/static/ash.jpg

#: generate all build-time deps
all: .FORCE $(ALL_TARGETS)
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

.PHONY: watch

#: watch for changes in a particular file and remake it when it changes
watch/%: .FORCE
	while true; do \
		$(MAKE) "$*"; \
		node -e 'require("fs").watch(".",()=>process.exit(1))'; \
		sleep 1; \
	done

#: watch for changes and remake any files that change
watch: watch/all

