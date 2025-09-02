import {
  Duration,
  Instant,
  LocalDateTime,
  ZoneId,
} from '@js-joda/core';
import { type ComponentProps, useEffect, useState } from 'react';
import Button from './button';

function secondsLeft (targetDate?: Date | null) {
  if (!targetDate) return 0;

  const duration = Duration.between(
    LocalDateTime.now(),
    LocalDateTime.ofInstant(
      Instant.ofEpochMilli(targetDate.getTime()),
      ZoneId.systemDefault(),
    ),
  );

  return duration.seconds();
}

export default function TimedButton ({
  toDate,
  label,
  isDisabled,
  ...btnProps
}: {
  toDate?: Date | null;
  label: string;
} & Omit<ComponentProps<typeof Button>, 'label'>) {
  const [count, setCount] = useState(() => secondsLeft(toDate));

  useEffect(() => {
    setCount(secondsLeft(toDate));

    const timer = setInterval(() => {
      setCount(secondsLeft(toDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [toDate]);

  return (
    <Button
      {...btnProps}
      label={`${count > 0 ? `${label} (${count})` : label}`}
      isDisabled={count > 0 || isDisabled}
    />
  );
}
