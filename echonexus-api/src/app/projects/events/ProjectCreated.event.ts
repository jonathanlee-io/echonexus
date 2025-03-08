export class ProjectCreatedEvent {
  static readonly eventName = 'project.created';

  constructor(
    public readonly requestingUserId: string,
    public readonly projectId: string,
  ) {}
}
