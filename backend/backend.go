package backend

var (
	STATIC_HOST = os.Getenv("STATIC_HOST")
)

type MimeMuxer map[string]http.Handler

var StaticProxy = httputil.NewSingleHostReverseProxy(
	net.URL{
		Scheme: "https",
		Host: STATIC_HOST,
	}
)

func ServeRedirect(rw http.ResponseWriter, rq *http.Request) {
	u, err := url.Parse(rq.RequestURI)
	if err != nil {
		log.Println(err)
		http.Error(rw, "invalid url", http.StatusBadRequest)
		return
	}

	u.Host = STATIC_HOST
	http.Redirect(
		rw,
		rq,
		u.String(),
		http.StatusTemporaryRedirect,
	)
}

var Handler = MimeMuxer {
// most assets can and should be delivered from the CDN
// (STATIC_HOST). We don't want the address in the URL
// bar to change, however, so for HTML pages we instead
// proxy the static host.
	"text/html": StaticProxy,
	"": ServeRedirect,
}


