import List "mo:core/List";
import Types "types/timetable";
import TimetableApi "mixins/timetable-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  let slots = List.empty<Types.TimeSlot>();
  let state = { var nextId : Types.SlotId = 1 };

  include TimetableApi(slots, state);
};
