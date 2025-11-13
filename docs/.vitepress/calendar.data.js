// dataExporter.js
import ICAL from "ical.js";

export default {
  async load() {
    const url = "https://calendar.google.com/calendar/ical/bfae575354c7f6c2411c32f7d957eaa96bd1c413cfbc6ec80408a40904b533e9%40group.calendar.google.com/public/basic.ics";

    try {
      const res = await fetch(url);
      const text = await res.text();
      const jcalData = ICAL.parse(text);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents("vevent");
      const events = [];
      const oneOffEvents = [];

      vevents.forEach((eventComp, index) => {
        const event = new ICAL.Event(eventComp);
        const attach = event.component.getFirstProperty("attach");
        const image = attach?.getParameter("FMTTYPE") || null;

        console.log("heeeelo", event.startDate.toJSDate());

        if (event.isRecurring()) {
          // Get the recurrence rule
          const rruleProp = event.component.getFirstProperty("rrule");
          const rrule = rruleProp ? rruleProp.getFirstValue() : null;

          // Get exception dates
          const exdates = event.component.getAllProperties("exdate").map((p) => {
            const val = p.getFirstValue();
            return val.toJSDate();
          });

          events.push({
            summary: event.summary || "",
            startTime: event.startDate.toJSDate().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
            startDate: event.startDate.toJSDate().toLocaleDateString("es-ES"),
            end: event.endDate.toJSDate(),
            image: image,
            location: event.location || "",
            ...JSON.parse(JSON.stringify(rrule)),
            exceptions: exdates,
          });
        } else {
          const now = ICAL.Time.now();
          const isPast = event.endDate ? event.endDate.compare(now) < 0 : false;

          if (isPast) return;
          events.push({
            summary: event.summary || "",
            startTime: event.startDate.toJSDate().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
            startDate: event.startDate.toJSDate().toLocaleDateString("es-ES"),
            image: image,
            byday: ["oneoff"],
            end: event.endDate.toJSDate(),
            location: event.location || "",
          });
        }
      });

      // Sort by start date
      events.sort((a, b) => a.startDate + b.startTime - (b.startDate + b.startTime));

      return { events };
    } catch (error) {
      console.error("Error loading calendar data:", error);
      return { events: [] };
    }
  },
};
