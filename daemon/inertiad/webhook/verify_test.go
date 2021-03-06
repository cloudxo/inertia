package webhook

import (
	"bytes"
	"io/ioutil"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

const (
	testBody      = `{"yo":true}`
	testSignature = "sha1=126f2c800419c60137ce748d7672e77b65cf16d6"
	testKey       = "0123456789abcdef"
)

func TestVerify(t *testing.T) {
	type args struct {
		host      string
		body      string
		header    string
		signature string
		key       string
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		// ok cases
		{
			"bitbucket",
			args{BitBucket, testBody, xHubSignatureHeader, testSignature, testKey},
			false,
		},
		{
			"bitbucket",
			args{BitBucket, testBody, xHubSignatureHeader, "", testKey},
			false,
		},
		{
			"github",
			args{GitHub, testBody, xHubSignatureHeader, testSignature, testKey},
			false,
		},
		{
			"gitlab",
			args{GitLab, testBody, gitlabTokenHeader, testKey, testKey},
			false,
		},

		// not ok cases
		{
			"no signature",
			args{GitHub, testBody, xHubSignatureHeader, "", testKey},
			true,
		},
		{
			"signature mismatch",
			args{BitBucket, testBody, xHubSignatureHeader, testSignature, "ohno"},
			true,
		},
		{
			"token mismatch",
			args{GitLab, testBody, gitlabTokenHeader, "", testKey},
			true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			buf := bytes.NewBufferString(tt.args.body)
			req, err := http.NewRequest("GET", "http://127.0.0.1/webhook", buf)
			assert.NoError(t, err)
			req.Header.Set(tt.args.header, tt.args.signature)
			req.Header.Set("Content-Type", "application/json")

			body, err := ioutil.ReadAll(req.Body)
			assert.NoError(t, err)

			if err := Verify(tt.args.host, tt.args.key, req.Header, body); (err != nil) != tt.wantErr {
				t.Errorf("Verify() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
