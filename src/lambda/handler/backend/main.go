//+build none

package main

import (
	"log"

	"os"

	"github.com/aws/aws-lambda-go/lambda"
)

func main() {

	runningLocally := os.Getenv("AWS_SAM_LOCAL") == "true"

	log.Println("api init / lambda")
	lambda.StartHandler(&httplambda.Handler{
		H:                  api.Handler,
		Requester:          httplambda.SetUserRequestContext(httplambda.DefaultRequester),
		LogRequestResponse: runningLocally,
	})
	panic("api handler quit unexpectedly!")
}
