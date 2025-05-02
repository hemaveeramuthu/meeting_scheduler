import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

const CalendarView = ({ meetings }) => {
  const events = meetings.map(meeting => ({
    id: meeting._id,
    title: meeting.title,
    start: meeting.date,
    backgroundColor: '#8b5cf6',
    borderColor: '#7c3aed',
    textColor: '#ffffff',
    extendedProps: {
      time: meeting.time,
      duration: meeting.duration,
      participants: meeting.participants,
      description: meeting.description
    }
  }));

  const renderEventContent = (eventInfo) => {
    return (
      <div className="p-1">
        <div className="font-semibold text-sm truncate">{eventInfo.event.title}</div>
        <div className="text-xs opacity-75">{eventInfo.event.extendedProps.time}</div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/50 p-6 mb-8">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        eventContent={renderEventContent}
        eventDidMount={(info) => {
          info.el.setAttribute('title', `
            ${info.event.title}
            Time: ${info.event.extendedProps.time}
            Duration: ${info.event.extendedProps.duration} mins
          `);
        }}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        dayMaxEvents={3}
        moreLinkContent={(args) => `+${args.num} more`}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
        themeSystem="standard"
      />
    </div>
  );
};

export default CalendarView; 