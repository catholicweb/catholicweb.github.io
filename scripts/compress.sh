#!/bin/bash

# Set the root directory for your media folder
MEDIA_DIR="docs/public"
cd $MEDIA_DIR
pwd

# Find all image files in the 'media' folder (jpg, png, jpeg, gif)
find media -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" \) | while read -r img; do
    # Get the original file's extension
    EXT="${img##*.}"
    
    # Create the new file name with .webp extension
    NEW_IMG="${img%.$EXT}"

    # Convert the image to .webp using cwebp
    #cwebp "$img" -o "$NEW_IMG-480.webp" -resize 480 0
    #cwebp "$img" -o "$NEW_IMG-720.webp" -resize 720 0
    #cwebp "$img" -o "$NEW_IMG-1080.webp" -resize 1080 0
    cwebp "$img" -o "$NEW_IMG.webp"
    
    # If the conversion is successful, replace the original references
    if [ $? -eq 0 ]; then
        echo "Converted $img to $NEW_IMG-480.webp" 
        # Find and replace occurrences of the original filename with the new .webp filename in all files
        find ../ -type f \( -iname "*.vue" -o -iname "*.md" \) -print0 | xargs -0 sed -i "s|$img|$NEW_IMG.webp|g"
        rm "$img"
    else
        echo "Failed to convert $img"
    fi
done