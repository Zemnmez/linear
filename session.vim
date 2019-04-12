let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/Documents/devel/linear
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +11 src/index.js
badd +79 src/components/Timeline/Timeline.module.css
badd +29 src/components/Profile/Profile.module.css
badd +37 src/components/Profile/index.js
badd +76 src/components/App/index.js
badd +1 src/components/Art/2Apr.js
badd +57 src/components/Art/Apr2nd2019.js
badd +8 src/components/Art/Art.module.css
badd +1 node_modules/babel-preset-react-app/index.js
badd +1 src/components/Load
badd +39 src/components/Load.js
badd +0 src/components/Load.module.css
badd +1 terminal\ yarn\ run\ react-scripts\ start
badd +0 term://.//15282:yarn\ run\ react-scripts\ start
badd +0 :e
argglobal
silent! argdel *
edit src/components/Load.module.css
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd w
wincmd _ | wincmd |
split
1wincmd k
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe '1resize ' . ((&lines * 22 + 23) / 47)
exe 'vert 1resize ' . ((&columns * 88 + 89) / 178)
exe '2resize ' . ((&lines * 22 + 23) / 47)
exe 'vert 2resize ' . ((&columns * 88 + 89) / 178)
exe '3resize ' . ((&lines * 35 + 23) / 47)
exe 'vert 3resize ' . ((&columns * 89 + 89) / 178)
exe '4resize ' . ((&lines * 9 + 23) / 47)
exe 'vert 4resize ' . ((&columns * 89 + 89) / 178)
argglobal
if bufexists('term://.//15282:yarn\ run\ react-scripts\ start') | buffer term://.//15282:yarn\ run\ react-scripts\ start | else | edit term://.//15282:yarn\ run\ react-scripts\ start | endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 51 - ((18 * winheight(0) + 11) / 22)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
51
normal! 0
wincmd w
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
let s:l = 4 - ((1 * winheight(0) + 11) / 22)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
4
normal! 0
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
let s:l = 24 - ((23 * winheight(0) + 17) / 35)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
24
normal! 0
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
let s:l = 40 - ((2 * winheight(0) + 4) / 9)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
40
normal! 026|
wincmd w
3wincmd w
exe '1resize ' . ((&lines * 22 + 23) / 47)
exe 'vert 1resize ' . ((&columns * 88 + 89) / 178)
exe '2resize ' . ((&lines * 22 + 23) / 47)
exe 'vert 2resize ' . ((&columns * 88 + 89) / 178)
exe '3resize ' . ((&lines * 35 + 23) / 47)
exe 'vert 3resize ' . ((&columns * 89 + 89) / 178)
exe '4resize ' . ((&lines * 9 + 23) / 47)
exe 'vert 4resize ' . ((&columns * 89 + 89) / 178)
tabnext 1
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
