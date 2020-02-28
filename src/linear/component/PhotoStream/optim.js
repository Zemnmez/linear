#!/usr/bin/env node
const glob = require("glob");
const child_process = require("child_process");
const sizeOf = reqire('image_size');

const sizes = `
1366x768
1920x1080
1280x800
320x568
1440x900
1280x1024
320x480
1600x900
768x1024
1024x768
1680x1050
360x640
1920x1200
720x1280
480x800
1360x768
1280x720`.split(/\s+/g).map(v => v.trim()).filter(v => v).map(v => v.split("x")).map(([width, height]) => ({ width, height }));

const targets = []

glob("photos/*", {} , (err, matches) => {
    if (err) throw err;
    for (const match of matches) {
        const { width, height } = sizeOf(match);
        const targetSizes = [];
        for (const { targetWidth, targetHeight} of sizes) {
            if (width < targetWidth || height < targetHeight) continue;
            targetSizes.push({width, height})
        };

        targets.push({
            name: match,
            width, height,
            targetSizes
        });
    }
})

console.log(targets);

const imagemagick_commands = [];

for (let { name, width, height, targetSizes } of targets) {
    for (const targetSize of targetSizes ) {
        imagemagick_commands.push(`( -resize ${[targetSize.width, targetSize.height].join("x")} -interlace plane )`)
    }
    imagemagick_commands.push(`( )`)
}