import { Controller, Post, Get, Put, Delete, Param } from '@nestjs/common';

@Controller('artists/:artist_id/members')
export class ArtistMembersController {
  @Post()
  addMembersToArtist(@Param('artist_id') artistId: string) {
    console.log(artistId);
    return 'artist members';
  }

  @Get()
  getSeveralMembersOfArtist(@Param('artist_id') artistId: string) {
    console.log(artistId);
    return 'artist members';
  }

  @Get()
  listMembersOfArtist(@Param('artist_id') artistId: string) {
    console.log(artistId);
    return 'artist members';
  }

  @Get(':member_id')
  getMemberOfArtist(
    @Param('artist_id') artistId: string,
    @Param('member_id') memberId: string,
  ) {
    console.log({ artistId, memberId });
    return 'artist members';
  }

  @Put()
  updateMembersOfArtist(@Param('artist_id') artistId: string) {
    console.log(artistId);
    return 'artist members';
  }

  @Delete(':member_id')
  deleteMemberOfArtist(
    @Param('artist_id') artistId: string,
    @Param('member_id') memberId: string,
  ) {
    console.log({ artistId, memberId });
    return 'artist members';
  }
}
