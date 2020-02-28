rm -i photos_assets/*
sizes=(1366x768 1920x1080 1280x800 320x568 1440x900 1280x1024 320x480 1600x900 768x1024 1024x768 1680x1050 360x640 1920x1200 720x1280 480x800 1360x768 1280x720)
for SIZE in "${sizes[@]}"; do
    echo "resize $SIZE";
    convert -verbose 'photos/*' -resize $SIZE\> -interlace Plane -quality 100 -set filename:f "photos_assets/%t_$SIZE.jpg" +adjoin '%[filename:f]'
done
convert -verbose 'photos/*' -interlace Plane -quality 100 -set filename:f 'photos_assets/%t_%wx%h.jpg' +adjoin '%[filename:f]'