public/% src/%: .FORCE
	$(MAKE) -C $(dir $@) $(notdir $@)

.PHONY: all
all: .FORCE public/manifest.json src/bio.json

.PHONY: invalidate cache
invalidate cache:
	./invalidate-cache.sh

.PHONY: .FORCE
.FORCE:
