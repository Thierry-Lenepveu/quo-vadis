export class EventSetting {
  Id: number;
  Subject: string;
  StartTime: Date;
  EndTime: Date;
  Description: string;
  Location: string;
  CategoryColor: string;

  constructor(
    Id = 0,
    Subject = "",
    StartTime: Date = new Date(),
    EndTime: Date = new Date(),
    Description = "",
    Location = "",
    CategoryColor = "",
  ) {
    this.Id = Id;
    this.Subject = Subject;
    this.StartTime = StartTime;
    this.EndTime = EndTime;
    this.Description = Description;
    this.Location = Location;
    this.CategoryColor = CategoryColor;
  }
}

export class EventSettings {
  dataSource: Omit<EventSetting, "id" | "location">[];
  allowAdding: false;
  allowDeleting: false;
  allowEditing: false;

  constructor(
    dataSource: Omit<EventSetting, "id" | "location">[] = [],
    allowAdding = false,
    allowDeleting = false,
    allowEditing = false,
  ) {
    this.dataSource = dataSource;
    this.allowAdding = allowAdding;
    this.allowDeleting = allowDeleting;
    this.allowEditing = allowEditing;
  }
}
