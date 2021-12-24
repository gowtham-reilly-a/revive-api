import { Injectable } from '@nestjs/common';
import { Ability, RawRuleOf } from '@casl/ability';
import { AlbumDocument } from 'src/albums/album.model';
import { ArtistDocument } from 'src/artists/artist.model';
import { TrackDocument } from 'src/tracks/track.model';
import { UserDocument } from 'src/users/user.model';
import { PermissionDocument } from 'src/permissions/permission.model';

export type Action = 'manage' | 'read' | 'create' | 'update' | 'delete';
export type Subjects =
  | 'User'
  | UserDocument
  | 'Album'
  | AlbumDocument
  | 'Artist'
  | ArtistDocument
  | 'Permission'
  | PermissionDocument
  | 'Track'
  | TrackDocument
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  getAblility(rawRules: RawRuleOf<AppAbility>[]) {
    return new Ability<[Action, Subjects]>(rawRules);
  }
}
