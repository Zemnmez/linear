%.tsx: %.jpg
	echo "import image from 'image.macro'; import Picture from '../Picture'; import React from 'react';export default () => <Picture {...image('$<')}/>" > $@

index.tsx: $(patsubst %.jpg,%.tsx,$(wildcard *.jpg))
	echo "import React from 'react'" > $@
	echo "export const Images = () => React.createElement(React.Fragment, {children:[" >> $@
	for file in $(patsubst %.tsx,%,$^); do \
		echo "React.createElement(React.lazy(() =>import('./$$file')))," >> $@; \
	done;
	echo "]});export default Images;" >> $@