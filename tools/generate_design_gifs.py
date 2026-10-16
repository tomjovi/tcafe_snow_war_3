"""Generate five original portrait GIF design explorations for the review page."""
from math import sin, cos, pi
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "design-previews"
OUT.mkdir(exist_ok=True)
W, H, SCALE = 360, 640, 2
FRAMES, DURATION = 24, 90
FONT_PATHS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]

def font(size, bold=False):
    path = FONT_PATHS[0 if bold else 1]
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()

def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

def center_text(draw, xy, text, fnt, fill, anchor="mm", stroke_width=0, stroke_fill=None):
    draw.text(xy, text, font=fnt, fill=fill, anchor=anchor, stroke_width=stroke_width, stroke_fill=stroke_fill)

def line(draw, pts, fill, width=1):
    draw.line(pts, fill=fill, width=width, joint="curve")

def shared_snow(draw, frame, color, count=28):
    for i in range(count):
        x = int((i * 97 + frame * (1 + i % 3) * 2.7) % W)
        y = int((i * 67 + frame * (2 + i % 4) * 1.9) % H)
        r = 1 + i % 3
        draw.ellipse((x-r, y-r, x+r, y+r), fill=color)

def label(draw, x, y, text, fill, size=10, bold=True):
    draw.text((x, y), text, font=font(size, bold), fill=fill)

def scene_tactical(frame):
    bg, panel, lime, pale, dim = "#101916", "#18251e", "#caff5b", "#eff6dc", "#53654d"
    im = Image.new("RGB", (W, H), bg); d = ImageDraw.Draw(im)
    for y in range(30, H, 24): line(d, [(0,y),(W,y)], "#1d2b23", 1)
    for x in range(0, W, 24): line(d, [(x,30),(x,H)], "#1d2b23", 1)
    label(d, 20, 14, "W / O   COMMAND", lime, 13); label(d, 21, 36, "WHITEOUT RESPONSE UNIT", dim, 8)
    rounded(d, (20,62,340,119), 4, panel, "#3b5333", 2)
    label(d, 32, 73, "SECTOR 04    //    AUTO FIRE", pale, 9)
    label(d, 32, 94, f"00:{24-frame//4:02d}", lime, 19)
    label(d, 205, 100, f"SCORE {100+frame*2:04d}", pale, 10)
    ax, ay, aw, ah = 27, 140, 306, 347
    d.rectangle((ax,ay,ax+aw,ay+ah), fill="#142019", outline="#8dab45", width=2)
    for x in range(ax+20,ax+aw,20): line(d,[(x,ay),(x,ay+ah)],"#233329",1)
    for y in range(ay+20,ay+ah,20): line(d,[(ax,y),(ax+aw,y)],"#233329",1)
    # radar sweep and scan target
    d.pieslice((90,190,270,370), (frame*9)%360, (frame*9)%360+48, fill="#caff5b16")
    for i,(x,y) in enumerate([(90,225),(252,269),(174,190)]):
        x += int(sin(frame/4+i)*10); y += int(cos(frame/5+i)*7)
        d.rectangle((x-10,y-11,x+10,y+11), fill="#34492f", outline=lime, width=2)
        center_text(d,(x,y),"×",font(14,True),lime)
    px=180+int(sin(frame/5)*47); py=430
    d.polygon([(px,py-20),(px-16,py+10),(px,py+4),(px+16,py+10)],fill=lime)
    d.ellipse((px-27,py-28,px+27,py+28),outline="#caff5b88",width=2)
    for j in range(3):
        yy=py-72-frame*5-j*44
        if yy>152: d.rectangle((px-3,yy-6,px+3,yy+6), fill=pale)
    label(d, 34, 457, "HOSTILE TRACKS   03", lime, 8)
    rounded(d,(20,503,340,607),4,panel,"#3b5333",2)
    label(d,32,516,"TACTICAL MOVEMENT",pale,9)
    rounded(d,(34,539,102,590),3,"#101916","#718554",2)
    center_text(d,(68,564),"◀  ◆  ▶",font(13,True),lime)
    label(d,120,546,"RAPID",dim,8); d.rectangle((120,562,315,570),fill="#34412f"); d.rectangle((120,562,120+(frame*7%196),570),fill=lime)
    label(d,120,581,"COOL-DOWN OVERRIDE    x2",lime,8)
    label(d,22,619,"MOVE TO TRACK · KEEP THE LINE",dim,8)
    shared_snow(d,frame,"#a4bb88",16)
    return im

def scene_postcard(frame):
    bg, ink, coral, cream, blue = "#eee3ca", "#334a49", "#df7053", "#fff9eb", "#a9c9cc"
    im=Image.new("RGB",(W,H),bg); d=ImageDraw.Draw(im)
    # paper grain
    for i in range(800):
        x=(i*73)%W; y=(i*127)%H
        d.point((x,y),fill="#e3d7bd")
    label(d,20,15,"WINTER POST / NO. 04",coral,10)
    center_text(d,(180,71),"WINTER POSTCARD",font(22,True),ink)
    center_text(d,(180,101),"A LITTLE SNOW, A LOT OF HEART",font(8),"#72817a")
    rounded(d,(19,127,341,502),3,cream,"#d2c4a7",2)
    # sky, moon, collage mountain layers
    d.rectangle((31,139,329,489),fill=blue)
    d.ellipse((228,165,285,222),fill="#f8e9bd")
    d.polygon([(31,336),(104,202),(164,331),(221,214),(329,348),(329,489),(31,489)],fill="#789999")
    d.polygon([(31,365),(123,276),(196,373),(270,251),(329,330),(329,489),(31,489)],fill="#657f79")
    d.polygon([(31,369),(102,421),(166,345),(240,419),(329,344),(329,489),(31,489)],fill="#fff9eb")
    # stamped UI
    rounded(d,(41,151,119,190),18,"#fff9eb")
    center_text(d,(80,171),f"{24-frame//4:02d} SEC",font(12,True),ink)
    rounded(d,(231,151,317,191),18,coral)
    center_text(d,(274,171),f"{100+frame*2} P",font(12,True),cream)
    # paper snowmen glide in
    for i,(bx,by) in enumerate([(97,267),(250,305),(178,232)]):
        x=bx+int(sin(frame/5+i)*16); y=by+int(cos(frame/7+i)*5)
        d.ellipse((x-16,y-7,x+16,y+25),fill=cream,outline=ink,width=2)
        d.ellipse((x-12,y-25,x+12,y-3),fill=cream,outline=ink,width=2)
        d.ellipse((x-5,y-16,x-2,y-13),fill=ink);d.ellipse((x+3,y-16,x+6,y-13),fill=ink)
        d.polygon([(x,y-9),(x+9,y-6),(x,y-4)],fill=coral)
    px=180+int(sin(frame/6)*53); py=443
    d.ellipse((px-24,py-5,px+24,py+5),fill="#637a6e44")
    d.rounded_rectangle((px-15,py-12,px+15,py+13),radius=9,fill="#476b6b",outline=ink,width=2)
    d.ellipse((px-11,py-37,px+11,py-15),fill=cream,outline=ink,width=2)
    d.ellipse((px-4,py-29,px-2,py-27),fill=ink);d.ellipse((px+3,py-29,px+5,py-27),fill=ink)
    for j in range(4):
        x=px-24+(j*13+frame*4)%48; y=py-65-j*26
        d.ellipse((x-4,y-4,x+4,y+4),fill=cream,outline="#abc2b3")
    label(d,37,460,"PAPER SNOWBALLS",ink,8)
    d.rectangle((19,520,341,601),fill="#e4d7bd")
    label(d,32,536,"TODAY'S SNOWFLAKE",ink,9);label(d,32,557,"AUTO POP!  POP!  POP!",coral,14)
    d.line((32,585,328,585),fill="#c1b496",width=2)
    label(d,32,590,"SLIDE SOFTLY. FIND A SNOWMAN.",ink,8)
    center_text(d,(180,623),"✳  A POSTCARD FROM THE SNOW  ✳",font(8,True),coral)
    shared_snow(d,frame,"#fff9eb",25)
    return im

def scene_hyperpop(frame):
    bg, navy, cyan, pink, yellow, white = "#8beaff", "#18204f", "#c8fbff", "#ff53b6", "#f8ff43", "#ffffff"
    im=Image.new("RGB",(W,H),bg); d=ImageDraw.Draw(im)
    # candy radial bursts
    for i in range(12):
        x=180+int(cos(i*pi/6)*250); y=330+int(sin(i*pi/6)*250)
        d.line((180,330,x,y),fill="#ffffff55",width=3)
    rounded(d,(13,12,347,111),22,white,navy,4)
    rounded(d,(25,23,70,68),14,pink,navy,3);center_text(d,(47,45),"✦",font(23,True),white)
    label(d,80,23,"FROST!",navy,16);label(d,80,48,"FRENZY!",pink,19)
    rounded(d,(25,76,164,100),11,yellow,navy,2);center_text(d,(94,88),"AUTO ATTACK ON!",font(9,True),navy)
    rounded(d,(181,76,333,100),11,cyan,navy,2);center_text(d,(257,88),f"TIME {24-frame//4:02d}  /  {100+frame*2} P",font(9,True),navy)
    # arena candy border
    rounded(d,(15,127,345,503),26,cyan,navy,5)
    d.ellipse((100,146,260,306),fill="#f8ff4370")
    d.polygon([(17,366),(77,324),(130,358),(194,307),(260,358),(343,317),(343,499),(17,499)],fill=white)
    # enemies bounce
    for i,(bx,by,col) in enumerate([(93,226,pink),(260,278,"#ff8d51"),(178,174,"#a37dff")]):
        x=bx+int(sin(frame/3+i)*11);y=by+int(cos(frame/4+i)*7)
        rounded(d,(x-22,y-24,x+22,y+23),17,col,navy,4)
        rounded(d,(x-14,y-7,x-4,y+3),4,white,navy,2);rounded(d,(x+4,y-7,x+14,y+3),4,white,navy,2)
        d.arc((x-9,y+2,x+9,y+17),0,180,fill=navy,width=3)
        rounded(d,(x-24,y+26,x+24,y+33),5,navy)
    px=180+int(sin(frame/4)*55);py=447
    rounded(d,(px-25,py-15,px+25,py+20),13,"#8364ff",navy,4)
    rounded(d,(px-19,py-45,px+19,py-8),17,white,navy,4)
    d.ellipse((px-9,py-32,px-4,py-27),fill=navy);d.ellipse((px+5,py-32,px+10,py-27),fill=navy)
    for j in range(3):
        x=px-10+j*10; y=py-66-(frame*6+j*38)%170
        d.ellipse((x-7,y-7,x+7,y+7),fill=yellow,outline=navy,width=3)
    rounded(d,(23,516,337,603),18,white,navy,4)
    label(d,39,531,"SLIDE TO DODGE",navy,12)
    rounded(d,(39,558,321,570),6,"#d5e5ea",navy,2);rounded(d,(39,558,39+(frame*17)%280,570),6,pink)
    label(d,39,580,"SPREAD +2",pink,11);label(d,218,581,"COMBO x03",navy,10)
    center_text(d,(180,626),"★  KEEP SLIDING!  ★",font(12,True),navy)
    shared_snow(d,frame,white,17)
    return im

def scene_noir(frame):
    bg, white, red, gray = "#111111", "#f3efe8", "#ff403c", "#77736d"
    im=Image.new("RGB",(W,H),bg);d=ImageDraw.Draw(im)
    d.polygon([(0,0),(235,0),(65,H),(0,H)],fill="#1c1c1c")
    d.polygon([(290,0),(360,0),(360,440),(175,640)],fill="#181818")
    label(d,20,17,"A WINTER / SURVIVAL FILM",gray,9)
    label(d,18,43,"LAST",white,34)
    label(d,18,80,"WHITEOUT",red,36)
    line(d,[(20,136),(340,136)],red,3)
    label(d,23,151,"30 SECONDS. NO SECOND CHANCES.",white,9)
    label(d,24,181,f"00:{24-frame//4:02d}",red,22);label(d,226,191,f"SCORE {100+frame*2:03d}",white,11)
    # spotlight slashes
    for i in range(4):
        x=33+i*85+int(sin(frame/5+i)*8)
        d.polygon([(x,220),(x+20,220),(x+84,486),(x+49,486)],fill="#ff403c12")
    # monochrome hostile silhouettes with red offset
    for i,(bx,by) in enumerate([(94,286),(274,336),(191,246)]):
        x=bx+int(sin(frame/4+i)*12); y=by+int(cos(frame/5+i)*8)
        d.rectangle((x-14+4,y-21+4,x+14+4,y+15+4),fill=red)
        d.rectangle((x-14,y-21,x+14,y+15),fill=white)
        d.rectangle((x-8,y-9,x-3,y-4),fill=bg);d.rectangle((x+4,y-9,x+9,y-4),fill=bg)
        d.polygon([(x,y-3),(x+7,y),(x,y+2)],fill=red)
    # harsh snow line and player
    d.polygon([(0,433),(75,410),(133,441),(227,409),(360,443),(360,520),(0,520)],fill="#d7d2c8")
    px=180+int(sin(frame/4)*55);py=475
    d.rectangle((px-17,py-19,px+17,py+20),fill=white)
    d.polygon([(px,py-45),(px-20,py-15),(px+20,py-15)],fill=red)
    d.rectangle((px-9,py-9,px-4,py-4),fill=bg);d.rectangle((px+5,py-9,px+10,py-4),fill=bg)
    for j in range(3):
        y=py-72-(frame*8+j*40)%180
        d.rectangle((px-2,y-8,px+2,y+8),fill=white)
    label(d,22,526,"KEEP MOVING.",white,19);label(d,22,550,"THEY NEVER STOP.",red,19)
    line(d,[(23,584),(337,584)],"#5a5651",2)
    label(d,24,598,"AUTO FIRE",red,10);label(d,229,598,"THREAT: HIGH",white,10)
    # frame jitter bars as stylized film scratches
    for i in range(6):
        yy=(i*109+frame*17)%H
        d.rectangle((0,yy,W,yy+1),fill="#ffffff24")
    return im

def scene_baseball(frame):
    bg, ink, ochre, snow, teal = "#718b7e", "#33443d", "#a95e42", "#fff8e9", "#54736b"
    im=Image.new("RGB",(W,H),bg);d=ImageDraw.Draw(im)
    # snowy mountain village, old tiled-roof house, fence and bare trees
    d.rectangle((0,160,W,490),fill="#a9c9c9")
    d.polygon([(0,291),(74,208),(145,278),(244,185),(360,280),(360,490),(0,490)],fill="#879f98")
    d.polygon([(0,323),(86,268),(158,319),(249,238),(360,326),(360,490),(0,490)],fill="#e5e7d8")
    d.rectangle((242,302,329,371),fill="#78553d")
    d.polygon([(233,304),(286,258),(339,304)],fill=ochre)
    d.rectangle((258,322,276,343),fill="#f5d899");d.rectangle((296,322,314,343),fill="#f5d899")
    # timber fence and telephone pole
    d.rectangle((19,364,30,448),fill="#54473a");d.rectangle((8,383,91,391),fill="#54473a");d.rectangle((8,412,91,420),fill="#54473a")
    d.rectangle((105,355,111,453),fill="#493e32");d.rectangle((89,366,137,372),fill="#493e32");d.rectangle((94,349,132,355),fill="#493e32")
    # layered snow foreground and snowbank mound
    d.polygon([(0,463),(72,443),(135,467),(211,442),(285,459),(360,435),(360,640),(0,640)],fill=snow)
    label(d,20,14,"RURAL WINTER / 1978",ink,10)
    center_text(d,(180,65),"SNOWBALL BASEBALL",font(21,True),ink)
    center_text(d,(180,94),"WINTER BREAK · HOME FIELD",font(8),"#50645c")
    rounded(d,(22,117,161,158),7,snow,"#c2b79c",2)
    center_text(d,(91,138),f"ROUND 01  ·  {24-frame//4:02d}s",font(10,True),ink)
    rounded(d,(198,117,338,158),7,"#e4bd73")
    center_text(d,(268,138),f"SCORE  {100+frame*5:04d}",font(11,True),ink)
    # friends in winter hats, one waiting at the pitch point
    for i,(bx,by) in enumerate([(89,302),(273,319),(180,250)]):
        x=bx+int(sin(frame/5+i)*10);y=by+int(cos(frame/6+i)*4)
        if i==1 and frame>18:
            # knockdown tumble after the returned snowball connects
            d.ellipse((x-22,y+14,x+20,y+29),fill="#78918a")
            d.ellipse((x-5,y+4,x+12,y+19),fill=snow)
            continue
        d.rounded_rectangle((x-14,y-2,x+14,y+24),radius=6,fill="#e9e3d3",outline=ink,width=2)
        d.ellipse((x-11,y-22,x+11,y),fill=snow,outline=ink,width=2)
        d.ellipse((x-4,y-14,x-2,y-12),fill=ink);d.ellipse((x+3,y-14,x+5,y-12),fill=ink)
        d.polygon([(x,y-8),(x+8,y-6),(x,y-4)],fill=ochre)
        d.pieslice((x-12,y-25,x+12,y-4),180,360,fill=ochre)
    # batter in a padded winter jacket, with the characteristic runny nose
    px=177+int(sin(frame/5)*26);py=490
    d.ellipse((px-25,py+20,px+25,py+29),fill="#78918a")
    d.rounded_rectangle((px-17,py-14,px+17,py+23),radius=8,fill=teal,outline=ink,width=2)
    d.ellipse((px-14,py-51,px+14,py-23),fill=snow,outline=ink,width=2)
    d.ellipse((px-6,py-43,px-4,py-41),fill=ink);d.ellipse((px+4,py-43,px+6,py-41),fill=ink)
    d.line((px+2,py-36,px+6,py-27),fill="#77bdca",width=3);d.ellipse((px+4,py-28,px+8,py-22),fill="#b9edf1")
    # branch winds up, sweeps through, then follows through
    phase=frame/23
    angle=1.25-min(1,phase*1.45)*2.45
    tip=(px+int(cos(angle)*67),py-23+int(sin(angle)*67))
    d.line((px+5,py-29,tip[0],tip[1]),fill="#4e3929",width=10)
    d.line((px+5,py-29,tip[0],tip[1]),fill="#b18a5c",width=5)
    # incoming pitch then a lofted return toward the friend
    if frame<11:
        q=frame/11;x=int(273+(px-273)*q);y=int(302+(py-48-302)*q-35*sin(pi*q))
    else:
        q=(frame-11)/13;x=int(px+(273-px)*q);y=int((py-48)-(py-48-305)*q-65*sin(pi*q))
    d.ellipse((x-9,y-9,x+9,y+9),fill=snow,outline="#947450",width=2)
    d.arc((x-5,y-5,x+5,y+5),-45,45,fill=ochre,width=1)
    # mobile controls and a sweet-spot pulse
    rounded(d,(23,555,337,607),10,"#f7f0de","#c9b891",2)
    center_text(d,(180,572),"SLIDE TO MOVE  ·  TAP TO SWING",font(10,True),ink)
    center_text(d,(180,590),"PULL LEFT  ◀       PUSH RIGHT  ▶",font(9,True),teal)
    if frame in (10,11,12):
        d.ellipse((px-42,py-99,px+42,py-18),outline="#ffd967",width=4)
        center_text(d,(180,214),"SWEET SPOT!",font(14,True),"#fff4a5")
    shared_snow(d,frame,"#fffdf5",22)
    return im

def scene_pixel(frame):
    # Draw at 180x320 and upscale with nearest-neighbor for authentic chunky pixels.
    w,h=180,320
    bg, navy, mint, snow, gold = "#13232b", "#173b49", "#5ef0d4", "#f3ffe8", "#ffcf59"
    im=Image.new("RGB",(w,h),bg);d=ImageDraw.Draw(im)
    d.rectangle((0,0,w,47),fill="#1b3440")
    d.rectangle((5,5,175,43),outline=mint,width=2)
    d.text((11,10),"GLACIER-198X",font=font(11,True),fill=mint)
    d.text((11,28),f"1UP {100+frame*2:04d}   T-{24-frame//4:02d}",font=font(9,True),fill=snow)
    # pixel scan lines and mountain skyline
    for y in range(48,h,4):d.line((0,y,w,y),fill="#19313a",width=1)
    d.rectangle((5,51,175,258),fill="#25485a",outline="#4d7a7a",width=2)
    d.ellipse((69,68,111,110),outline="#b6ffe8",width=2)
    d.polygon([(6,182),(38,132),(60,164),(94,116),(128,174),(151,131),(174,173),(174,256),(6,256)],fill="#43808a")
    d.rectangle((6,207,174,256),fill="#d9f0d8")
    # enemies pixel snow imps
    for i,(bx,by,col) in enumerate([(47,130,"#fff6d8"),(136,158,"#d8f8ef"),(91,116,"#fff0c1")]):
        x=bx+int(sin(frame/3+i)*7);y=by+int(cos(frame/4+i)*4)
        d.rectangle((x-9+3,y-9+3,x+9+3,y+9+3),fill=navy)
        d.rectangle((x-9,y-9,x+9,y+9),fill=col,outline=navy,width=2)
        d.rectangle((x-5,y-3,x-2,y),fill=navy);d.rectangle((x+3,y-3,x+6,y),fill=navy)
    # player and automatic pixel snowballs
    px=90+int(sin(frame/4)*27);py=233
    d.rectangle((px-10+3,py-8+3,px+10+3,py+8+3),fill=navy)
    d.rectangle((px-10,py-8,px+10,py+8),fill=gold,outline=navy,width=2)
    d.rectangle((px-7,py-17,px+7,py-8),fill=snow,outline=navy,width=2)
    for j in range(3):
        y=py-28-(frame*5+j*23)%107
        d.rectangle((px-2,y-2,px+2,y+2),fill=snow)
    # pixel item inventory and movement arrows
    d.rectangle((5,266,175,309),fill="#1b3440",outline=mint,width=2)
    d.text((12,274),"MOVE  <  +  >",font=font(9,True),fill=snow)
    d.text((12,291),"ITEM: SPREAD II",font=font(9,True),fill=mint)
    for y in range(50,h,8):
        d.line((0,y,w,y),fill="#5ef0d408",width=1)
    return im.resize((W,H),Image.Resampling.NEAREST)

SCENES = [
    ("01-whiteout-command.gif", scene_tactical),
    ("02-winter-postcard.gif", scene_postcard),
    ("03-frost-frenzy.gif", scene_hyperpop),
    ("04-snow-noir.gif", scene_noir),
    ("05-glacier-198x.gif", scene_pixel),
    ("06-winter-baseball.gif", scene_baseball),
]

for filename, render in SCENES:
    frames = [render(i).convert("P", palette=Image.Palette.ADAPTIVE, colors=192) for i in range(FRAMES)]
    path = OUT / filename
    frames[0].save(path, save_all=True, append_images=frames[1:], duration=DURATION, loop=0, optimize=True, disposal=2)
    print(f"{path.relative_to(ROOT)}: {path.stat().st_size:,} bytes")
