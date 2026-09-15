import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const adminEmail = process.env.ADMIN_EMAIL || "raj.prajapati@codexa.dev";
    const adminGithub = process.env.ADMIN_GITHUB_USERNAME || "rajprajapati";

    if (!user) {
      throw new ForbiddenException("Authentication required.");
    }

    const isOwner =
      user.role === "ADMIN" ||
      user.email?.toLowerCase() === adminEmail.toLowerCase() ||
      user.githubUsername?.toLowerCase() === adminGithub.toLowerCase();

    if (!isOwner) {
      throw new ForbiddenException(
        "Access Denied: Only the platform owner (Raj Prajapati) has permission to make changes.",
      );
    }

    return true;
  }
}
