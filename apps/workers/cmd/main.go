package main

import (
	"log"
	"time"

	"github.com/Sachin1373/hireflow/worker/internal/db"
	"github.com/Sachin1373/hireflow/worker/internal/jobs"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("Error loading root .env")
	}

	db.Connect()

	log.Println("Worker started")

	for {
		err := jobs.ProcessExpiredJobs()

		if err != nil {
			log.Println(err)
		}

		time.Sleep(1 * time.Minute)
	}
}
