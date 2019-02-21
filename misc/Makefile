%.ascii.txt: %.txt
	cat $< | toilet > $@

%.xpm: %.ascii.txt %.txt
	echo '/* XPM */' > $@
	echo "$$(awk 'NR==1{print length($0)}' $<) $$(wc -l $< | awk '{print $$1}') 2 1" | xargs >> $@
	fold -w1 "$<" | sort -u | sed '/^ /d' | while read CHR; do \
		echo "$$CHR c #000000" >> $@; \
	done

	echo "  c #ffffff" >> $@
	cat $< >> $@
	head $@

%.pbm: %.ascii.txt %.txt
	echo "P1" > $@
	echo "$$(awk 'NR==1{print length($0)}' $<) $$(wc -l $< | awk '{print $$1}')" | xargs >> $@
	sed 's/[^ ]/1/g;s/ /0/g' $< >> $@
	head $@

%.png: %.pbm
	convert "$<" "$@"
