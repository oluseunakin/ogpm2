import { HStack, Input, Button, Text, Heading, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { bookAppointment } from "../lib/appointments";

export function Appointment({ admin, dailyAppointment, appointments }) {
  const [name, setName] = useState("");
  const [allAppointments, setAllAppointments] = useState([]);
  const [rendered, setRendered] = useState(dailyAppointment);
  return admin === "lucas" ? (
    dailyAppointment.length != 0 ? (
      <Stack>
        <HStack>
          <Heading as="h4" textAlign="center">
            You have Appointments with
          </Heading>
          <Button
            onClick={() => {
              setAllAppointments(appointments);
              setRendered(allAppointments)
            }}
          >
            See all Appointments
          </Button>
        </HStack>
        <Stack spacing="3">
          {rendered.map((apt) => (
            <Text>{apt.name}</Text>
          ))}
        </Stack>
      </Stack>
    ) : (
      <Heading textAlign='center'>You have no Appointments for today</Heading>
    )
  ) : (
    <HStack>
      <Input value={name} onChange={(e) => setName(e.currentTarget.value)} />
      <Button onClick={() => bookAppointment(name)}>Book Appointment</Button>
    </HStack>
  );
}
