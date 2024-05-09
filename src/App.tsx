import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { TfiArrowCircleDown } from "react-icons/tfi";

const moment = extendMoment(Moment);

interface Duration {
  year: string;
  month: string;
  day: string;
}

function App() {
  const errorMessages = {
    day: "Must be a valid day",
    month: "Must be a valid month",
    year: "Must be a valid year",
  };

  const setDuration = (currentDate: Date, data: FieldValues): Duration => {
    const startDate = moment(
      `${
        currentDate.getMonth() + 1
      }/${currentDate.getDate()}/${currentDate.getFullYear()}`
    );

    const endDate = moment(`${data.month}/${data.day}/${data.year}`);

    const duration = moment.duration(startDate.diff(endDate));

    return {
      year:
        duration.years() < 10
          ? "0" + duration.years().toString()
          : duration.years().toString(),
      month:
        duration.months() < 10
          ? "0" + duration.months().toString()
          : duration.months().toString(),
      day:
        duration.days() < 10
          ? "0" + duration.days().toString()
          : duration.days().toString(),
    };
  };

  const schema = z.object({
    day: z
      .number({ invalid_type_error: errorMessages.day })
      .min(1, { message: errorMessages.day })
      .max(31, { message: errorMessages.day }),
    month: z
      .number({ invalid_type_error: errorMessages.month })
      .min(1, { message: errorMessages.month })
      .max(12, { message: errorMessages.month }),
    year: z
      .number({ invalid_type_error: errorMessages.year })
      .max(2023, { message: errorMessages.year }),
  });

  type FormData = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [invalidDate, setInvalidDate] = useState<boolean>(false);
  const [date, setDate] = useState<Duration | null>(null);

  const onSubmit = (data: FieldValues) => {
    // Clear invalid
    if (invalidDate) setInvalidDate(false);
    if (date) setDate(null);

    const enteredDate = new Date(`${data.year}-${data.month}-${data.day}`);
    const currentDate = new Date();

    if (
      enteredDate.getFullYear() != data.year ||
      enteredDate.getMonth() + 1 != data.month ||
      enteredDate.getDate() != data.day
    ) {
      setInvalidDate(true);
    } else {
      // Calculate Date
      setDate(setDuration(currentDate, data));
    }
  };

  const handleOnChange = (type: "day" | "month" | "year") => {
    clearErrors([type]);
    setInvalidDate(false);
    setDate(null);
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "800px", margin: "0 auto", background: "#cfcfcf" }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-3">
            <label htmlFor="day">day</label>
            <input
              className={
                errors.day ? "form-control border-danger" : "form-control"
              }
              {...register("day", { valueAsNumber: true })}
              type="text"
              name="day"
              id="day"
              onChange={() => handleOnChange("day")}
            />
            {errors.day && <p className="text-danger">{errors.day.message}</p>}
          </div>
          <div className="col-3">
            <label htmlFor="month">month</label>
            <input
              className={
                errors.month ? "form-control border-danger" : "form-control"
              }
              {...register("month", { valueAsNumber: true })}
              type="text"
              name="month"
              id="month"
              onChange={() => handleOnChange("month")}
            />
            {errors.month && (
              <p className="text-danger">{errors.month.message}</p>
            )}
          </div>
          <div className="col-3">
            <label htmlFor="year">year</label>
            <input
              className={
                errors.year ? "form-control border-danger" : "form-control"
              }
              {...register("year", { valueAsNumber: true })}
              type="text"
              name="year"
              id="year"
              onChange={() => handleOnChange("year")}
            />
            {errors.year && (
              <p className="text-danger">{errors.year.message}</p>
            )}
          </div>
          {invalidDate && <p className="text-danger">Must be a valid date</p>}
        </div>
        <div className="row">
          <div className="offset-9 col-3">
            <button className="btn" type="submit">
              <TfiArrowCircleDown />
              {/* <img src="./src/assets/favicon-32x32.png" /> */}
            </button>
          </div>
        </div>
      </form>
      <div>
        <h3>
          <span>{date?.year ? date.year : "--"}</span> years
        </h3>
        <h3>
          <span>{date?.month ? date.month : "--"}</span> months
        </h3>
        <h3>
          <span>{date?.day ? date.day : "--"}</span> days
        </h3>
      </div>
    </div>
  );
}

export default App;
