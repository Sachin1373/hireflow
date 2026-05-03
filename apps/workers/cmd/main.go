package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/Sachin1373/hireflow/worker/internal/config"
	"github.com/Sachin1373/hireflow/worker/internal/db"
	"github.com/Sachin1373/hireflow/worker/internal/scheduler"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		panic(err)
	}

	db.Connect(cfg)

	log.Println("Worker started")

	ctx, stop := signal.NotifyContext(
		context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
	)

	defer stop()

	scheduler.StartWorker(ctx, cfg)

	log.Println("Worker stopped gracefully")
}
