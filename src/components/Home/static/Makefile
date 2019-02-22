%-optim.jpg: %-original.jpg
	npx jpegoptim -s -o "$<"
	cp "$<" "$@"


%-optim-progressive.jpg: %-optim.jpg
	npx jpegtran -progressive -outfile "$@" "$<"

%.jpg: %-optim-progressive.jpg
	cp "$<" "$@"

