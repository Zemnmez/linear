sizes = 48x48 72x72 96x96 128x128 144x144 152x152 192x192 384x384 256x256 512x512

png_icons = $(addsuffix .png, $(sizes))
ico_icons = $(addsuffix .ico, 16x16 32x32 48x48 64x64)

get_dimension = $(word $2,$(subst x, ,$1))
get_width = $(call get_dimension, $1, 1)
get_height = $(call get_dimension, $1, 2)

%.png: logo.svg
	inkscape -z \
		-e '$(abspath $@)' \
		-w "$(call get_width, $*)" \
		-h "$(call get_height, $*)" \
		'$(realpath $<)'

%.ico: %.png
	convert $< $@

%.json: %
	echo "empty" '$(filter-out .svg,$(suffix $*))'
	jq -n \
		--arg src "$<" \
		--arg sizes$(if $(filter-out .svg,$(suffix $*)),\
			"$$(identify -format '%wx%h' $<)",\
			"any"\
		) \
		'{src: $$src, sizes: $$sizes}' > $@


manifest.json: logo.svg.json \
		$(addsuffix .json, $(png_icons)) \
		$(addsuffix .json, $(ico_icons))
	jq -s '.' $^ > $@

logo.svg:
	cp ../$@ $@
