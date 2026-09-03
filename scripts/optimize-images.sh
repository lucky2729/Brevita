#!/bin/bash
echo "Optimizing all dish images..."

for img in /Users/lucky/Downloads/Brevita/images/dishes/*.jpg; do
  sips -Z 800 "$img" -s formatOptions 82 > /dev/null 2>&1
done

for img in /Users/lucky/Downloads/Brevita/public/images/dishes/*.jpg; do
  sips -Z 800 "$img" -s formatOptions 82 > /dev/null 2>&1
done

echo "Finished optimizing images!"
du -sh /Users/lucky/Downloads/Brevita/images/dishes
