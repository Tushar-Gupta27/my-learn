# 1st way

### AUDIO

```bash
ffmpeg -i in.video -vn -acodec libvorbis -ab 128k -dash 1 my_audio.webm
```

### VIDEO

```bash
ffmpeg -i in.video -c:v libvpx-vp9 -keyint_min 150 \
-g 150 -tile-columns 4 -frame-parallel 1 -f webm -dash 1 \
-an -vf scale=160:90 -b:v 250k -dash 1 video_160x90_250k.webm \
-an -vf scale=320:180 -b:v 500k -dash 1 video_320x180_500k.webm \
-an -vf scale=640:360 -b:v 750k -dash 1 video_640x360_750k.webm \
-an -vf scale=640:360 -b:v 1000k -dash 1 video_640x360_1000k.webm \
-an -vf scale=1280:720 -b:v 1500k -dash 1 video_1280x720_1500k.webm
```

### MANIFEST FILE

```bash
ffmpeg \
  -f webm_dash_manifest -i video_160x90_250k.webm \
  -f webm_dash_manifest -i video_320x180_500k.webm \
  -f webm_dash_manifest -i video_640x360_750k.webm \
  -f webm_dash_manifest -i video_1280x720_1500k.webm \
  -f webm_dash_manifest -i my_audio.webm \
  -c copy \
  -map 0 -map 1 -map 2 -map 3 -map 4 \
  -f webm_dash_manifest \
  -adaptation_sets "id=0,streams=0,1,2,3 id=1,streams=4" \
  my_video_manifest.mpd
```


# 2nd Way

### VIDEO
```bash
    ffmpeg -i input.mp4 -vf scale=1280:-1 -c:v libx264 -b:v 2000k -c:a aac -b:a 128k output_1080p.mp4
    ffmpeg -i input.mp4 -vf scale=854:-1 -c:v libx264 -b:v 1000k -c:a aac -b:a 96k output_720p.mp4
    ffmpeg -i input.mp4 -vf scale=640:-1 -c:v libx264 -b:v 500k -c:a aac -b:a 64k output_480p.mp4
```

### MANIFEST
```bash
    ffmpeg -i output_1080p.mp4 -i output_720p.mp4 -i output_480p.mp4 \
    -map 0:v:0 -map 0:a:0 \
    -map 1:v:0 -map 1:a:0 \
    -map 2:v:0 -map 2:a:0 \
    -f dash -seg_duration 4 -use_timeline 1 -use_template 1 -init_seg_name '$RepresentationID$/init.mp4' -media_seg_name '$RepresentationID$/segment_$Number$.m4s' \
    output.mp
```