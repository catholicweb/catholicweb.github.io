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
      const recurrentEvents = [];
      const oneOffEvents = [];

      vevents.forEach((eventComp, index) => {
        const event = new ICAL.Event(eventComp);

        if (event.isRecurring()) {
          // Get the recurrence rule
          const rruleProp = event.component.getFirstProperty("rrule");
          const rrule = rruleProp ? rruleProp.getFirstValue() : null;

          // Get exception dates
          const exdates = event.component.getAllProperties("exdate").map((p) => {
            const val = p.getFirstValue();
            return val.toJSDate();
          });

          recurrentEvents.push({
            summary: event.summary || "",
            start: event.startDate.toJSDate(),
            end: event.endDate.toJSDate(),
            location: event.location || "",
            recurrence: rrule,
            exceptions: exdates,
          });
        } else {
          const now = ICAL.Time.now();
          const isPast = event.endDate ? event.endDate.compare(now) < 0 : false;

          if (isPast) return;
          oneOffEvents.push({
            summary: event.summary || "",
            start: event.startDate.toJSDate(),
            end: event.endDate.toJSDate(),
            location: event.location || "",
          });
        }
      });

      // Sort by start date
      recurrentEvents.sort((a, b) => a.start - b.start);
      oneOffEvents.sort((a, b) => a.start - b.start);

      console.log(`Final: ${recurrentEvents.length} recurring, ${oneOffEvents.length} one-off events`);

      return { recurrentEvents, oneOffEvents };
    } catch (error) {
      console.error("Error loading calendar data:", error);
      return { recurrentEvents: [], oneOffEvents: [] };
    }
  },
};
