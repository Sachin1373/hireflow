package interview

import (
	"fmt"

	"github.com/google/uuid"
)

func GenerateMeetLink() string {
	roomID := uuid.New().String()

	return fmt.Sprintf(
		"https://meet.jit.si/%s",
		roomID,
	)

}
