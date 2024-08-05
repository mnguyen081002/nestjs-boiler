// import { HttpStatus, Injectable, Logger } from "@nestjs/common";
// import { ApiConfigService } from "../../shared/services/api-config.service";
// import { OAuth2Client } from "google-auth-library";
// import { UserService } from "../user/user.service";
// import { CustomHttpException } from "../../common/exception/custom-http.exception";
// import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
// import { UserEntity } from "../../entities/user.entity";
// import axios from "axios";
// import { FBGetUserInfoResponse, GithubGetUserInfoResponse } from "./dto/UserLoginDto";

// export interface SocialService {
//   login: (accessToken: string, social_user_id?: string) => Promise<UserEntity>;
// }

// @Injectable()
// export class GoogleAuthService implements SocialService {
//   private readonly logger: Logger = new Logger(GoogleAuthService.name);
//   private readonly client: OAuth2Client;

//   constructor(
//     private readonly apiConfigService: ApiConfigService,
//     private readonly userService: UserService,
//   ) {
//     this.client = new OAuth2Client(
//       this.apiConfigService.GoogleConfig.APP_ID,
//       this.apiConfigService.GoogleConfig.APP_SECRET,
//     );
//   }
//   async getUser(accessToken: string) {
//     const ticket = await this.client.verifyIdToken({
//       idToken: accessToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     return ticket.getPayload();
//   }

//   // async login(token: string, social_user_id?: string) {
//   //   try {
//   //     const Guser = await this.getUser(token);

//   //     let user = await this.userService.findOne({
//   //       email: Guser.email,
//   //       settings: {
//   //         isEmailVerified: true,
//   //       },
//   //     });

//   //     if (!user) {
//   //       // register
//   //       user = await this.userService.createUserSocial({
//   //         email: Guser.email,
//   //         avatar: Guser.picture,
//   //         social: "google",
//   //         username: Guser.name,
//   //       });
//   //     }
//   //     return user;
//   //   } catch (error) {
//   //     throw new CustomHttpException({
//   //       statusCode: HttpStatus.UNAUTHORIZED,
//   //       code: StatusCodesList.InvalidCredentials,
//   //       message: "Có lỗi xảy ra",
//   //       error,
//   //     });
//   //   }
//   // }
// }

// @Injectable()
// export class FacebookAuthService implements SocialService {
//   private readonly logger: Logger = new Logger(FacebookAuthService.name);

//   constructor(private readonly userService: UserService) {}

//   async getUser(accessToken: string, social_user_id: string) {
//     const r = await axios.get<FBGetUserInfoResponse>(
//       `https://graph.facebook.com/v17.0/${social_user_id}`,
//       {
//         params: {
//           fields: "id,name,email,picture",
//           access_token: accessToken,
//         },
//       },
//     );

//     return r.data;
//   }

//   // async login(token: string, social_user_id?: string) {
//   //   try {
//   //     const Fuser = await this.getUser(token, social_user_id);

//   //     let user = await this.userService.findOne({
//   //       email: Fuser.email,
//   //     });

//   //     if (!user?.settings?.isEmailVerified) {
//   //       await this.userService.deleteUserById(user.id);
//   //     }

//   //     if (!user || !user?.settings?.isEmailVerified) {
//   //       user = await this.userService.createUserSocial({
//   //         email: Fuser.email,
//   //         avatar: Fuser.picture.data.url,
//   //         social: "facebook",
//   //         username: Fuser.name,
//   //       });
//   //     }

//   //     delete user.social;
//   //     return user;
//   //   } catch (error) {
//   //     this.logger.error(error);
//   //     throw new CustomHttpException({
//   //       statusCode: HttpStatus.UNAUTHORIZED,
//   //       code: StatusCodesList.InvalidCredentials,
//   //       message: "Có lỗi xảy ra",
//   //       error,
//   //     });
//   //   }
//   // }
// }

// @Injectable()
// export class GithubAuthService implements SocialService {
//   private readonly logger: Logger = new Logger(GithubAuthService.name);

//   constructor(private readonly userService: UserService) {}

//   async getUser(accessToken: string) {
//     const r = await axios.get<GithubGetUserInfoResponse>("https://api.github.com/user", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     const e = await axios.get("https://api.github.com/user/emails", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     const email = e.data.find((e) => e.primary)?.email;
//     return {
//       ...r.data,
//       email,
//     };
//   }

//   async login(token: string, social_user_id?: string) {
//     try {
//       const GHuser = await this.getUser(token);

//       let user = await this.userService.findOne({
//         email: GHuser.email,
//       });

//       if (!user?.settings?.isEmailVerified) {
//         await this.userService.deleteUserById(user.id);
//       }

//       if (!user || !user?.settings?.isEmailVerified) {
//         user = await this.userService.createUserSocial({
//           email: GHuser.email,
//           avatar: GHuser.avatar_url,
//           social: "github",
//           username: GHuser.name,
//         });
//       }
//       return user;
//     } catch (error) {
//       if (error instanceof CustomHttpException) {
//         throw error;
//       }

//       throw new CustomHttpException({
//         statusCode: HttpStatus.UNAUTHORIZED,
//         code: StatusCodesList.InvalidCredentials,
//         message: "Có lỗi xảy ra",
//         error,
//       });
//     }
//   }
// }
