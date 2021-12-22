import { Injectable } from '@nestjs/common';
import { Ability, RawRuleOf } from '@casl/ability';
import { AlbumDocument } from 'src/albums/album.model';
import { ArtistDocument } from 'src/artists/artist.model';
import { TrackDocument } from 'src/tracks/track.model';
import { UserDocument } from 'src/users/user.model';

type Action = 'manage' | 'read' | 'create' | 'update' | 'delete';
type Subjects =
  | 'User'
  | UserDocument
  | 'Album'
  | AlbumDocument
  | 'Artist'
  | ArtistDocument
  | 'Track'
  | TrackDocument
  | 'all';

type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  getAblility(rawRules: RawRuleOf<AppAbility>[]) {
    return new Ability<[Action, Subjects]>(rawRules);
  }
}

export enum ActionEnum {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export enum SubjectEnum {
  Album = 'Album',
  All = 'all',
  Artist = 'Artist',
  Track = 'Track',
  User = 'User',
}
