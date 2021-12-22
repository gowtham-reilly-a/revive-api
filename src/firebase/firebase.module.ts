import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from 'src/users/users.module';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [
    FirebaseService,
    FirebaseAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
  ],
  exports: [FirebaseService],
})
export class FirebaseModule {}
