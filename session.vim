let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/Documents/devel/linear
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +1 term://.//16113:yarn\ react-scripts\ start
badd +11 src/index.js
badd +79 src/components/Timeline/Timeline.module.css
badd +29 src/components/Profile/Profile.module.css
badd +37 src/components/Profile/index.js
badd +64 src/components/App/index.js
badd +1 src/components/Art/2Apr.js
badd +101 src/components/Art/Apr2nd2019.js
badd +8 src/components/Art/Art.module.css
badd +1 node_modules/babel-preset-react-app/index.js
badd +1 src/components/Load
badd +37 src/components/Load.js
badd +1 src/components/Graph/index.js
badd +19 public/index.html
badd +4 .env
badd +1 .env.production
badd +1 .env.development
badd +24 src/components/CV/index.js
argglobal
silent! argdel *
set stal=2
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
argglobal
if bufexists('term://.//16113:yarn\ react-scripts\ start') | buffer term://.//16113:yarn\ react-scripts\ start | else | edit term://.//16113:yarn\ react-scripts\ start | endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 1 - ((0 * winheight(0) + 21) / 42)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 0
tabedit .env.development
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe '1resize ' . ((&lines * 12 + 22) / 45)
exe 'vert 1resize ' . ((&columns * 88 + 89) / 178)
exe '2resize ' . ((&lines * 29 + 22) / 45)
exe 'vert 2resize ' . ((&columns * 88 + 89) / 178)
exe 'vert 3resize ' . ((&columns * 89 + 89) / 178)
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 1 - ((0 * winheight(0) + 6) / 12)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 06|
wincmd w
argglobal
if bufexists('src/components/Graph/index.js') | buffer src/components/Graph/index.js | else | edit src/components/Graph/index.js | endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 84 - ((14 * winheight(0) + 14) / 29)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
84
normal! 0106|
wincmd w
argglobal
if bufexists('src/components/App/index.js') | buffer src/components/App/index.js | else | edit src/components/App/index.js | endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 58 - ((41 * winheight(0) + 21) / 42)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
58
normal! 0
wincmd w
2wincmd w
exe '1resize ' . ((&lines * 12 + 22) / 45)
exe 'vert 1resize ' . ((&columns * 88 + 89) / 178)
exe '2resize ' . ((&lines * 29 + 22) / 45)
exe 'vert 2resize ' . ((&columns * 88 + 89) / 178)
exe 'vert 3resize ' . ((&columns * 89 + 89) / 178)
tabnext 2
set stal=1
if exists('s:wipebuf') && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 winminheight=1 winminwidth=1 shortmess=filnxtToOFI
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
