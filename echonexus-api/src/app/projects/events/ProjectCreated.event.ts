export class ProjectCreatedEvent {
  static readonly eventName = 'project.created';

  constructor(
    public readonly requestingUserSubjectId: string,
    public readonly projectId: string,
  ) {}
}
