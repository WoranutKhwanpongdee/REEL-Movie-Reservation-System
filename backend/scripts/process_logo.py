import os
from PIL import Image, ImageOps

src_path = r"C:\Users\HP\.gemini\antigravity-ide\brain\9f92bbb3-aaf6-4a17-860b-ea83d492b980\.user_uploaded\media_1787890049332.png"
dest_dir = r"d:\Personal\REEL-Movie Reservation System\frontend\public"
os.makedirs(dest_dir, exist_ok=True)

img = Image.open(src_path).convert("RGBA")

# Save original
img.save(os.path.join(dest_dir, "logo-original.png"))

# Create transparent version (turning white/near-white pixels transparent)
datas = img.getdata()
new_data_transparent = []
new_data_darkmode = []

for item in datas:
    r, g, b, a = item
    # Check if pixel is white or near white background
    if r > 240 and g > 240 and b > 240:
        new_data_transparent.append((255, 255, 255, 0))
        new_data_darkmode.append((255, 255, 255, 0))
    else:
        new_data_transparent.append(item)
        # For dark mode logo: if color is dark/black text (low r, g, b), turn to white (255, 255, 255, a)
        if r < 80 and g < 80 and b < 80:
            new_data_darkmode.append((255, 255, 255, a))
        else:
            new_data_darkmode.append(item)

# 1. Transparent original colors
img_transparent = Image.new("RGBA", img.size)
img_transparent.putdata(new_data_transparent)

# Auto crop whitespace bounding box
bbox = img_transparent.getbbox()
if bbox:
    img_transparent_cropped = img_transparent.crop(bbox)
else:
    img_transparent_cropped = img_transparent

img_transparent_cropped.save(os.path.join(dest_dir, "logo-transparent.png"))

# 2. Dark mode logo (white text for 'REEL' & subtitle + red 'CINEMA' + reel)
img_dark = Image.new("RGBA", img.size)
img_dark.putdata(new_data_darkmode)
if bbox:
    img_dark_cropped = img_dark.crop(bbox)
else:
    img_dark_cropped = img_dark

img_dark_cropped.save(os.path.join(dest_dir, "logo.png"))
img_dark_cropped.save(os.path.join(dest_dir, "logo-dark.png"))

# 3. Reel Icon Only (crop just the left film reel)
# Calculate reel bounding box (left part of the cropped image)
w, h = img_transparent_cropped.size
# The reel is roughly the left ~35%
reel_bbox = (0, 0, int(h * 1.15), h)
reel_icon = img_transparent_cropped.crop(reel_bbox)
# Get exact bounding box of the reel
r_bbox = reel_icon.getbbox()
if r_bbox:
    reel_icon = reel_icon.crop(r_bbox)

# Make icon square with padding
max_dim = max(reel_icon.size)
square_icon = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
offset_x = (max_dim - reel_icon.width) // 2
offset_y = (max_dim - reel_icon.height) // 2
square_icon.paste(reel_icon, (offset_x, offset_y))

square_icon.save(os.path.join(dest_dir, "logo-icon.png"))

# 4. Generate Favicon
fav = square_icon.resize((64, 64), Image.Resampling.LANCZOS)
fav.save(os.path.join(dest_dir, "favicon.ico"), format="ICO")
fav.save(r"d:\Personal\REEL-Movie Reservation System\frontend\src\app\favicon.ico", format="ICO")

print("Logo assets generated successfully!")
print("Saved files in frontend/public:")
for f in os.listdir(dest_dir):
    print(" -", f)
