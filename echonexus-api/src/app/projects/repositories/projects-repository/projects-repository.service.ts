import {Injectable, InternalServerErrorException} from '@nestjs/common';

import {PrismaService} from '../../../../lib/prisma/services/prisma.service';
import {UsersRepositoryService} from '../../../users/repositories/users-repository/users-repository.service';
import {CreateProjectDto} from '../../dto/CreateProject.dto';
import {UpdateProjectDto} from '../../dto/UpdateProject.dto';

@Injectable()
export class ProjectsRepositoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersRepository: UsersRepositoryService,
  ) {}

  async create(
    requestingUserSubjectId: string,
    {
      clientId,
      name,
      subdomain,
      isBugReportsEnabled,
      isFeatureRequestsEnabled,
      isFeatureFeedbackEnabled,
    }: CreateProjectDto,
  ) {
    const user = await this.usersRepository.findBySupabaseId(
      requestingUserSubjectId,
    );
    if (!user) {
      throw new InternalServerErrorException(
        `Could not find user with id: ${requestingUserSubjectId}`,
      );
    }
    const [createdProject, createdSubdomain] =
      await this.prismaService.$transaction(async (prisma) => {
        const createdProject = await prisma.project.create({
          data: {
            name,
            isBugReportsEnabled,
            isFeatureRequestsEnabled,
            isFeatureFeedbackEnabled,
            client: {
              connect: {
                id: clientId,
              },
            },
            createdBy: {
              connect: {
                id: user.id,
              },
            },
          },
          include: {
            createdBy: true,
            client: true,
            subdomains: true,
            hostnames: true,
          },
        });

        const createdSubdomain = await prisma.subdomain.create({
          data: {
            subdomain,
            project: {
              connect: {
                id: createdProject.id,
              },
            },
          },
        });

        return [createdProject, createdSubdomain];
      });
    return {
      ...createdProject,
      subdomains: [createdSubdomain],
    };
  }

  async getProjectsWhereInvolved(requestingUserSubjectId: string) {
    const clientsWhereInvolved = await this.prismaService.client.findMany({
      where: {
        OR: [
          {
            members: {
              some: {
                supabaseUserId: requestingUserSubjectId,
              },
            },
          },
          {
            admins: {
              some: {
                supabaseUserId: requestingUserSubjectId,
              },
            },
          },
        ],
      },
      include: {
        createdBy: true,
        members: true,
        admins: true,
        projects: true,
      },
    });

    return this.prismaService.project.findMany({
      where: {
        clientId: {in: clientsWhereInvolved.map((client) => client.id)},
      },
      include: {
        createdBy: true,
        client: true,
        hostnames: true,
        subdomains: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(projectId: string) {
    return this.prismaService.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        createdBy: true,
        client: true,
        hostnames: true,
        subdomains: true,
      },
    });
  }

  async updateProjectById(
    projectId: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    return this.prismaService.project.update({
      where: {
        id: projectId,
      },
      data: {
        isBugReportsEnabled: updateProjectDto.isBugReportsEnabled,
        isFeatureRequestsEnabled: updateProjectDto.isFeatureRequestsEnabled,
        isFeatureFeedbackEnabled: updateProjectDto.isFeatureFeedbackEnabled,
      },
      include: {
        createdBy: true,
        client: true,
        hostnames: true,
        subdomains: true,
      },
    });
  }

  async getProjectsForClient(clientId: string) {
    return this.prismaService.project.findMany({
      where: {
        clientId,
      },
      include: {
        createdBy: true,
        client: true,
        subdomains: true,
        hostnames: true,
      },
    });
  }

  async findBySubdomain(
    clientSubdomain: string,
    overrides?: {isIncludeCreatedBy?: boolean; isIncludeClient?: boolean},
  ) {
    return this.prismaService.project.findMany({
      where: {
        subdomains: {
          some: {
            subdomain: clientSubdomain,
          },
        },
      },
      include: {
        createdBy: overrides?.isIncludeCreatedBy,
        client: overrides?.isIncludeClient,
      },
    });
  }

  async deleteProjectById(projectId: string) {
    return this.prismaService.project.delete({
      where: {
        id: projectId,
      },
    });
  }
}
