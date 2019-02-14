public/% src/%: .FORCE
	$(MAKE) -C $(dir $@) $(notdir $@)

.PHONY: all
all: .FORCE public/manifest.json src/bio.json

.PHONY: .FORCE
.FORCE:
