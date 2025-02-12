export class EventSetting {
  Subject: string;
  StartTime: Date;
  EndTime: Date;
  Description: string;
  CategoryColor: string;

  constructor(
    Subject = "",
    StartTime: Date = new Date(),
    EndTime: Date = new Date(),
    Description = "",
    CategoryColor = "",
  ) {
    this.Subject = Subject;
    this.StartTime = StartTime;
    this.EndTime = EndTime;
    this.Description = Description;
    this.CategoryColor = CategoryColor;
  }
}

export class EventSettings {
  dataSource: EventSetting[];
  allowAdding: false;
  allowDeleting: false;
  allowEditing: false;

  constructor(
    dataSource: EventSetting[] = [],
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
