import {
  Input,
  Heading,
  Stack,
  Textarea,
  Button,
  Text,
  IconButton,
  Icon,
  useToast,
  Spinner
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getRequests, requestPrayer } from "../lib/prayerRequest";
import { BsFillCaretLeftFill } from "react-icons/bs";

export function PrayerRequest({ admin, home }) {
  const [name, setName] = useState("");
  const [request, setRequest] = useState("");
  let requests = [];
  const toast = useToast()

  useEffect(() => {
    requests = getRequests();
  }, [name, request]);

  return (
    <Stack spacing="4">
      <Stack spacing="3">
        <IconButton
          width="max-content"
          onClick={() => {
            home();
          }}
          aria-label="Go to the main page"
          icon={<Icon as={BsFillCaretLeftFill} />}
        />
        <Input
          value={name}
          placeholder="Your name"
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <Textarea
          value={request}
          placeholder="Type your request"
          onChange={(e) => setRequest(e.currentTarget.value)}
        />
        <Button
          onClick={() => {
            const res = requestPrayer(name, request);
            home()
            toast({description: res})
          }}
          w="max-content"
          alignSelf="flex-end"
        >
          Request
        </Button>
      </Stack>
      {admin && admin === 'lucas' && (
        <Stack spacing="4">
          {requests.map((req) => {
            <Stack spacing="2">
              <Heading as="h6">{req.name}</Heading>
              <Text>{req.request}</Text>
            </Stack>;
          })}
        </Stack>
      )}
    </Stack>
  );
}
