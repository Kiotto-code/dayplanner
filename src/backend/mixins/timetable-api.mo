import List "mo:core/List";
import Types "../types/timetable";
import TimetableLib "../lib/timetable";

mixin (
  slots : List.List<Types.TimeSlot>,
  state : { var nextId : Types.SlotId },
) {
  public func createSlot(args : Types.CreateSlotArgs) : async Types.TimeSlotView {
    TimetableLib.create(slots, state, args);
  };

  public query func listSlots() : async [Types.TimeSlotView] {
    TimetableLib.getAll(slots);
  };

  public func updateSlot(args : Types.UpdateSlotArgs) : async ?Types.TimeSlotView {
    TimetableLib.update(slots, args);
  };

  public func deleteSlot(id : Types.SlotId) : async Bool {
    TimetableLib.delete(slots, id);
  };

  public func toggleSlotComplete(id : Types.SlotId) : async ?Types.TimeSlotView {
    TimetableLib.toggleComplete(slots, id);
  };
};
