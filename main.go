package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"github.com/wneessen/go-mail"
	"log"
	"os"
	"strconv"
	"strings"
)

func main() {
	fmt.Println("Hello GDSC!")
	if ok := os.Getenv("GO_ENV"); ok != "production" {
		err := godotenv.Load(".env")
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}
	// ? Email template parser
	// Sender data.
	formdata := data()

	from := os.Getenv("SMTP_FROM")
	smtpPass := os.Getenv("SMTP_PASS")
	smtpUser := os.Getenv("SMTP_USER")

	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort, err := strconv.Atoi(os.Getenv("SMTP_PORT"))
	if err != nil {
		fmt.Println("KUY")
	}
	html, err := os.ReadFile("./email.html")
	if err != nil {
		fmt.Println("KUY")
	}
	for i := 0; i < len(formdata); i++ {
		email := formdata[i].Email
		to := email
		output := strings.Replace(string(html), "{{NAME}}", formdata[i].Name, -1)
		m := mail.NewMsg()
		m.From(from)
		m.To(to)
		m.Subject("MODLINK2")
		m.SetBodyString(mail.TypeTextHTML, output)
		d, err := mail.NewClient(smtpHost, mail.WithPort(smtpPort), mail.WithTLSPolicy(mail.TLSMandatory), mail.WithSMTPAuth(mail.SMTPAuthPlain),
			mail.WithUsername(smtpUser), mail.WithPassword(smtpPass))
		if err != nil {
			fmt.Println(err)
		}
		// Send Email
		if err := d.DialAndSend(m); err != nil {
			fmt.Println(err)
			fmt.Println(formdata[i].Name + " Fail")
			break
		}
		fmt.Println(formdata[i].Name + " DONE")
	}

}
