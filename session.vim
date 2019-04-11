let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/Documents/devel/linear
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +1 term://.//4278:yarn\ react-scripts\ start
badd +11 src/index.js
badd +79 src/components/Timeline/Timeline.module.css
badd +29 src/components/Profile/Profile.module.css
badd +37 src/components/Profile/index.js
badd +68 src/components/App/index.js
badd +1 src/components/Art/2Apr.js
badd +101 src/components/Art/Apr2nd2019.js
badd +8 src/components/Art/Art.module.css
badd +1 node_modules/babel-preset-react-app/index.js
badd +1 src/components/Load
badd +0 src/components/Load.js
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
if bufexists('term://.//4278:yarn\ react-scripts\ start') | buffer term://.//4278:yarn\ react-scripts\ start | else | edit term://.//4278:yarn\ react-scripts\ start | endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 1 - ((0 * winheight(0) + 22) / 44)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 0
tabedit src/components/App/index.js
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 88 + 89) / 178)
exe 'vert 2resize ' . ((&columns * 89 + 89) / 178)
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
let s:l = 60 - ((13 * winheight(0) + 22) / 44)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
60
normal! 028|
wincmd w
argglobal
if bufexists('src/components/Load.js') | buffer src/components/Load.js | else | edit src/components/Load.js | endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 36 - ((35 * winheight(0) + 22) / 44)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
36
normal! 013|
wincmd w
exe 'vert 1resize ' . ((&columns * 88 + 89) / 178)
exe 'vert 2resize ' . ((&columns * 89 + 89) / 178)
tabnext 1
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
